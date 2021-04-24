class SystemController < ActionController::Base
  before_action :authenticate_user!

  def desktop
    @apps = Apps.all
  end

  def lockscreen
    
  end

end
