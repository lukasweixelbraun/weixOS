class SystemController < ActionController::Base
  before_action :authenticate_user!

  def desktop
    @apps = current_user.apps
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
