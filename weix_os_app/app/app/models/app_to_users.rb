class AppToUsers < ApplicationRecord
  self.table_name = "t_app2users"

  belongs_to :user
  belongs_to :app

end
    