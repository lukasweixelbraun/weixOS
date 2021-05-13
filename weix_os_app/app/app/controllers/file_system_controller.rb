class FileSystemController < ActionController::Base

  def upload
    
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