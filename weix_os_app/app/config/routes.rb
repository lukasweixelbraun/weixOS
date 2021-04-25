Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root to: "system#desktop"

  namespace :my_apps do
    post 'update_pos' => 'apps#update_pos', as: :update_pos
    post 'open_window' => 'apps#open_window', as: :open_window
  end

end
