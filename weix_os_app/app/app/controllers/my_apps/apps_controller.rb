module MyApps
  class AppsController < ApplicationController
    before_action :authenticate_user!
    
    def update_pos
      app = Apps.find(params[:id])
      app.pos_x = params[:pos_x]
      app.pos_y = params[:pos_y]
      app.save
    end
  
    def open_window
      app = Apps.find(params[:id])
      render partial: "#{app.template_name}", locals: { app: app }
    end
  
  end
end