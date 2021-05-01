Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root to: "system#desktop"

  post 'system/create_message' => 'system#create_message', as: :create_message
  post 'system/load_apps' => 'system#load_apps', as: :load_apps

  namespace :my_apps do
    # app
    post 'update_pos' => 'app#update_pos', as: :update_pos
    post 'create_sym_link' => 'app#create_sym_link', as: :create_sym_link
    post 'open_context_menu' => 'app#open_context_menu', as: :open_context_menu
    post 'add_app_to_desktop' => 'app#add_app_to_desktop', as: :add_app_to_desktop
    post 'remove_app_from_desktop' => 'app#remove_app_from_desktop', as: :remove_app_from_desktop
    post 'add_app_to_favorites' => 'app#add_app_to_favorites', as: :add_app_to_favorites
    post 'remove_app_from_favorites' => 'app#remove_app_from_favorites', as: :remove_app_from_favorites
    post 'search' => 'app#search', as: :search

    # window save_window_state
    post 'save_window_state' => 'app#save_window_state', as: :save_window_state
    post 'update_window_pos' => 'app#update_window_pos', as: :update_window_pos
    post 'open_window' => 'app#open_window', as: :open_window
    post 'close_window' => 'app#close_window', as: :close_window
  end

end
