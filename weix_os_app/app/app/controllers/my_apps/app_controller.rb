module MyApps
  class AppController < ApplicationController
    before_action :authenticate_user!
    
    def update_pos
      user_app = current_user.user_apps.where(app_id: params[:id]).first
      user_app.pos_x = params[:pos_x]
      user_app.pos_y = params[:pos_y]
      user_app.save
    end

    def update_window_pos
      user_app = current_user.user_apps.where(app_id: params[:id]).first
      user_app.window_pos_x = params[:window_pos_x]
      user_app.window_pos_y = params[:window_pos_y]
      user_app.save
    end
  
    def open_window
      app = current_user.apps.find(params[:id])
      window_pos_x = params[:window_pos_x]
      window_pos_y = params[:window_pos_y]
      
      user_app = current_user.user_apps.where(app_id: params[:id]).first
      user_app.is_opened = true
      user_app.save!
      
      return render partial: "#{app.template_name}", locals: { app: app, pos_x: window_pos_x, pos_y: window_pos_y }
    end

    def close_window
      user_app = current_user.user_apps.where(app_id: params[:id]).first
      user_app.is_opened = false
      user_app.save!

      render :json => { :success => true }
    end
  
  end
end