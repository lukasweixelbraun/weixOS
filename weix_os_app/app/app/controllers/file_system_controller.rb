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

  def chdir
    current_dir = Dir.pwd
    Dir.chdir(current_dir + params['path'])

    return render partial: '/my_apps/file_tree'
  end

  def download
    Rails.logger.info("#{Rails.root.join('data').to_s + params['path']}")

    send_file(
      "#{Rails.root.join('data').to_s + params['path']}",
      filename: File.basename(params['path']),
      type: "application/text"
    )
  end

end