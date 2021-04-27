class User < ApplicationRecord
  self.table_name = "t_users"

  has_many :user_apps, class_name: "AppToUsers"
  has_many :apps, through: :user_apps

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable, :recoverable, :rememberable and :omniauthable
  devise :database_authenticatable, :registerable, :validatable

  
end
