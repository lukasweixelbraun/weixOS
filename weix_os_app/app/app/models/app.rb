class App < ApplicationRecord
  self.table_name = "t_app"

  has_many :user_apps, class_name: "AppToUsers"
  has_many :users, through: :user_apps
  
end
  