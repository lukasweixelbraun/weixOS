class SystemController < ActionController::Base
  before_action :authenticate_user!

  def desktop
    
  end

  def load_apps
    apps = current_user.apps.as_json({:include => [ :user_apps ]})
    
    Rails.logger.info(apps)

    return render json: apps
  end

  def create_message
    type = params[:type]
    title = params[:title]
    message = params[:message]
    inputs = params[:inputs]

    return render partial: 'system/messages/default_message', locals: { type: type, title: title, message: message, inputs: inputs }
  end

  def lockscreen
    
  end

end
