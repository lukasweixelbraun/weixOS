# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_10_23_155952) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "t_app", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.string "template_name", null: false
    t.string "img_src", null: false
  end

  create_table "t_app2users", id: :serial, force: :cascade do |t|
    t.integer "app_id", null: false
    t.integer "user_id", null: false
    t.decimal "pos_x", default: "0.0"
    t.decimal "pos_y", default: "0.0"
    t.decimal "window_pos_x", default: "50.0"
    t.decimal "window_pos_y", default: "50.0"
    t.boolean "is_opened", default: false
    t.boolean "desktop_link", default: false
    t.boolean "toolbar_link", default: false
    t.string "last_state"
  end

  create_table "t_users", force: :cascade do |t|
    t.string "firstname", default: "", null: false
    t.string "lastname", default: "", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "username"
    t.index ["email"], name: "index_t_users_on_email", unique: true
    t.index ["username"], name: "index_t_users_on_username", unique: true
  end

  add_foreign_key "t_app2users", "t_app", column: "app_id", name: "t_app2users_app_id_fkey"
  add_foreign_key "t_app2users", "t_users", column: "user_id", name: "t_app2users_user_id_fkey"
end
