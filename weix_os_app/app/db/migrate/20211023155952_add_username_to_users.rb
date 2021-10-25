class AddUsernameToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :t_users, :username, :string
    add_index :t_users, :username, unique: true
  end
end
