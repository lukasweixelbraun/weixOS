class SystemController < ActionController::Base
  before_action :authenticate_user!

  def desktop
    @apps = current_user.apps
  end

  def lockscreen
    
  end

end
