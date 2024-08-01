using SocialMediaApp.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;

namespace SocialMediaApp.Controllers
{
    public class LoginController : Controller
    {
        SocialMediaAppEntities db = new SocialMediaAppEntities();
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult HomePage()
        {
            var responseData = ViewBag.ResponseData;

            return View();
        }
        public ActionResult AboutPage()
        {
            var responseData = ViewBag.ResponseData;
            return View();
        }
        public ActionResult MessagePage()
        {

            return View();
        }
        public ActionResult Notification()
        {
            var responseData = ViewBag.ResponseData;


            return View();
        }
        public ActionResult UserProfile()
        {
            var responseData = ViewBag.ResponseData;


            return View();
        }

        public ActionResult ForgotPassword()
        {
            var responseData = ViewBag.ResponseData;


            return View();
        }
        public ActionResult ResetPassword()
        {
            var responseData = ViewBag.ResponseData;


            return View();
        }
        public ActionResult ValidOtp()
        {
            var responseData = ViewBag.ResponseData;


            return View();
        }


    }

}