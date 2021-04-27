Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root to: "system#desktop"

  namespace :my_apps do
    post 'update_pos' => 'app#update_pos', as: :update_pos
    post 'update_window_pos' => 'app#update_window_pos', as: :update_window_pos

    post 'open_window' => 'app#open_window', as: :open_window
    post 'close_window' => 'app#close_window', as: :close_window
  end

end
