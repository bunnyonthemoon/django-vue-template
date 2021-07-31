from django.urls import include, path

from . import views

urlpatterns = [
    path("user/", views.get_user),
    path("login/", views.LoginView.as_view()),
    path("signup/", views.SignupView.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("change_auth/", views.ChangeAuthView.as_view()),
]
