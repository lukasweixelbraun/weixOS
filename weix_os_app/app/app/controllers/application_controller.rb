class ApplicationController < ActionController::Base

  before_action :configure_permitted_parameters, if: :devise_controller?

  def guest_sign_in
    sign_in(:user, guest_user)
    redirect_to "/"
  end

  protected

  def configure_permitted_parameters
    added_attrs = [:username, :email, :firstname, :lastname, :password, :password_confirmation]
    devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
    devise_parameter_sanitizer.permit :sign_in, keys: [:login, :password]
    devise_parameter_sanitizer.permit :account_update, keys: added_attrs
  end

  private

  def guest_user
    return User.where(:firstname => "Gast").first || create_guest_user
  end

  def create_guest_user
    u = User.create(:username => "gast", :firstname => "Gast", :email => "guest_#{Time.now.to_i}#{rand(99)}@example.com")
    u.save(:validate => false)
    u
  end
  
end
