module MyApps
  class AppController < ApplicationController
    before_action :authenticate_user!
    
    ### APP ###

    def search
      apps = App.where("'#{params[:searchText]}' != '' and (name ilike '%#{params[:searchText]}%' or name ilike '%#{params[:searchText]}%')")
      return render partial: "system/toolbar/app_search_result", locals: { apps: apps }
    end

    

    # app icon position on desktop has changed, save it!
    def update_pos
      user_app = current_user.user_apps.where(app_id: params[:id]).first_or_create
      user_app.pos_x = params[:pos_x]
      user_app.pos_y = params[:pos_y]
      user_app.save

      return render :json => { :success => true }
    end

    # open context menu analog open_window
    def open_context_menu
      app = current_user.apps.find(params[:id])
      template = params[:template]
      return render partial: "system/context_menu", locals: { app: app, template: template }
    end

    # desktop shortcut created, save the changes!
    def remove_app_from_desktop
      user_app = current_user.user_apps.where(app_id: params[:id]).first_or_create
      user_app.desktop_link = false
      user_app.save

      return render :json => { :success => true }
    end

    # add icon to desktop
    def add_app_to_desktop
      app = current_user.apps.find(params[:id])
      user_app = app.user_apps.where(user_id: current_user.id).first_or_create # analog desktop
      user_app.desktop_link = true
      user_app.save
      return render partial: "system/app/app", locals: { app: app, user_app: user_app }
    end

    def remove_app_from_favorites
      user_app = current_user.user_apps.where(app_id: params[:id]).first_or_create
      user_app.toolbar_link = false
      user_app.save

      return render :json => { :success => true }
    end

    def add_app_to_favorites
      user_app = current_user.user_apps.where(app_id: params[:id]).first_or_create
      user_app.toolbar_link = true
      user_app.save

      return render :json => { :success => true }
    end



    ### APP Window ###

    # window state of an app has changed, save it!
    def save_window_state
      # can be multible states (hidden, fullscreen)
      user_app = current_user.user_apps.where(app_id: params[:id]).first_or_create
      user_app.last_state = params[:last_state]
      user_app.save

      return render :json => { :success => true }
    end

    # window position of an app has changed, save it!
    def update_window_pos
      user_app = current_user.user_apps.where(app_id: params[:id]).first_or_create
      user_app.window_pos_x = params[:window_pos_x]
      user_app.window_pos_y = params[:window_pos_y]
      user_app.save

      return render :json => { :success => true }
    end
  
    # render window --> save state is_opened = true
    def open_window
      app_id = params[:id]
      template_name = params[:template_name]
      window_pos_x = params[:window_pos_x]
      window_pos_y = params[:window_pos_y]
      last_state = params[:last_state]
      
      user_app = current_user.user_apps.where(app_id: params[:id]).first_or_create
      user_app.is_opened = true
      user_app.save
      
      return render partial: "system/app/app_window", locals: { app_id: app_id, template_name: template_name, pos_x: window_pos_x, pos_y: window_pos_y, last_state: last_state }
    end

    # window has been closed --> save state is_opened = false
    def close_window
      user_app = current_user.user_apps.where(app_id: params[:id]).first_or_create
      user_app.is_opened = false
      user_app.save!

      return render :json => { :success => true }
    end
  
  end
end