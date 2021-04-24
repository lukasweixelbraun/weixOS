class AppsController < ActionController
  before_action :authenticate_user!
  
  def update_pos
    app = Apps.find(params[:id])
    app.pos_x = params[:pos_x]
    app.pos_y = params[:pos_y]
    app.save
  end

end