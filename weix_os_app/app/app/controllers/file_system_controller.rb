class FileSystemController < ActionController::Base

  def upload
    files = params[:files]

    files.each do |file|
      File.open(File.join(Dir.pwd, file.original_filename), 'wb+') do |f|
        f.write file.read
        f.close
      end
    end

    return render partial: '/my_apps/file_tree'
  end

  def download
    file = File.join(Dir.pwd, params['name'])

    if File.file?(file)
      send_file(
        file,
        filename: params['name'],
        type: "application/text"
      )
    else
      download_dir(Dir.pwd, params['name'])
    end
  end

  def open_context_menu
    name = params[:name]
    path = params[:path]
    template = params[:template]

    return render partial: "context_menus/#{template}", locals: { name: name, path: path }
  end

  def delete
    file_to_delete = File.join(Dir.pwd, params['name'])

    if File.file?(file_to_delete)
      File.delete(file_to_delete)
    else
      FileUtils.rm_rf(file_to_delete)
    end

    return render partial: '/my_apps/file_tree'
  end

  def create_dir
    new_dir = File.join(Dir.pwd, params['name'])
    Dir.mkdir(new_dir)

    return render partial: '/my_apps/file_tree'
  end

  def chdir
    user_dir = Rails.root.join('data', current_user.firstname)
    Dir.chdir(File.join(user_dir, params['path']))

    return render partial: '/my_apps/file_tree'
  end

  def update_nav
    return render partial: '/my_apps/file_navigation', locals: {current_dir: Dir.pwd}
  end

  private 

  # WIP read Files to Add to zip recursive if file = dir
  def download_dir(path, name)
    #Attachment name
    filename = name + '.zip'
    temp_file = Tempfile.new(filename)

    begin
      #This is the tricky part
      #Initialize the temp file as a zip file
      Zip::OutputStream.open(temp_file) { |zos| }

      #Add files to the zip file as usual
      Zip::File.open(temp_file.path, Zip::File::CREATE) do |zip|
        #Put files in here
        Dir.glob(File.join(path, name, '*')).each do |file|
          zip.add(File.basename(file), file) # WIP --> glob if file = dir
        end
      end

      #Read the binary data from the file
      zip_data = File.read(temp_file.path)

      #Send the data to the browser as an attachment
      #We do not send the file directly because it will
      #get deleted before rails actually starts sending it
      send_data(zip_data, :type => 'application/zip', :filename => filename)
    ensure
      #Close and delete the temp file
      temp_file.close
      temp_file.unlink
    end
  end

end