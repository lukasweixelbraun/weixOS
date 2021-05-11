class SystemController < ActionController::Base
  include SystemInfoHelper

  before_action :authenticate_user!

  def desktop
    
  end

  def fetch_system_info
    return render json: {
      cpu: SystemInfoHelper.cpu_usage(),
      memory: SystemInfoHelper.memory_usage(),
      swap: SystemInfoHelper.swap_usage(),
      temp: SystemInfoHelper.temperature(),
      upgradables: SystemInfoHelper.upgradables()
    }
  end

  def load_apps
    apps = App.all
    user_app_data = current_user.user_apps
    
    Rails.logger.info({apps: apps.to_a, user_data: user_app_data.to_a})

    return render json: {apps: apps.to_a, user_data: user_app_data.to_a}
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
