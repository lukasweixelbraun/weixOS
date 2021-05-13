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
    send_file(
      File.join(Dir.pwd, params['name']),
      filename: params['name'],
      type: "application/text"
    )
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

end