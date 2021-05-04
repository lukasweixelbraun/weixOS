class ApplicationController < ActionController::Base

  def guest_sign_in
    sign_in(:user, guest_user)
    redirect_to "/"
  end

  private

  def guest_user
    return User.where(:firstname => "Gast").first || create_guest_user
  end

  def create_guest_user
    u = User.create(:firstname => "Gast", :email => "guest_#{Time.now.to_i}#{rand(99)}@example.com")
    u.save(:validate => false)
    u
  end
end
