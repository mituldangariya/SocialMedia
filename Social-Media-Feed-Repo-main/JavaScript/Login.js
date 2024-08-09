$(document).ready(function () {
    // Function to set a cookie
    //function setCookie(cookieName, cookieValue, expirationDays) {
    //    var d = new Date();
    //    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    //    var expires = "expires=" + d.toUTCString();
    //    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    //}
    //function setCookie(name, value, days) {
    //    var expires = "";
    //    if (days) {
    //        var date = new Date();
    //        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    //        expires = "; expires=" + date.toUTCString();
    //    }
    //    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    //}

    /*function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
*/

    function setCookie(name, value, minutes) {
        var expires = "";
        if (minutes) {
            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }


    function getCookie(cookieName) {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookieArray = decodedCookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "";
    }
    
    function checkCookie(cookieName) {
        var cookieValue = getCookie(cookieName);
        if (cookieValue != "") {
            return true;
        } else {
            return false;
        }
    }

    function deleteCookie(cookieName) {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        const re = /^(?=.*[0-9])(?=.{6,})/;
        return re.test(password);
    }



    function hasLeadingOrTrailingSpaces(str) {
        return str !== str.trim();
    }

    window.handleLogin = function () {
        var email = document.getElementById("Email").value;
        var password = document.getElementById("Password").value;

        if (!email || validateEmail(email) === false || hasLeadingOrTrailingSpaces(email)) {
            $("#loginError").text("Please Enter a Valid Email Without Spaces.");
            return;
        }
        if (!password) {
            $("#loginError").text("Please Enter Your Password.");
            return;
        }
        if (validatePassword(password) === false || hasLeadingOrTrailingSpaces(password)) {
            $("#loginError").text("Password must be at least 6 characters long, contain at least one number.");
            return;
        }

        $.ajax({
            url: '/api/WebApi/Login',
            type: 'GET',
            data: { email: email, password: password },

            success: function (response) {
                if (response.User && response.Token) {
                    setCookie('userId', response.User.UserId, 30);
                    setCookie('authToken', response.Token, 30); // Set authToken cookie for 30 days
                    console.log("Login successful", response);
                    window.location.href = "/Login/HomePage";
                }  else {
                    $("#loginError").text("Invalid login response.");
                }
            },
            error: function (xhr, status, error) {
                console.log("Login failed", error);
                $("#loginError").text("Email or password invalid.");
            }
        });
    };

    window.handleSignup = function () {
        const name = document.getElementById("Name").value;
        const email = document.getElementById("NewEmail").value;
        const fname = document.getElementById("fName").value;
        const confirmPassword = document.getElementById("ConfirmPassword").value;
        const password = document.getElementById("NewPassword").value;

        if (!fname) {
            $("#NewloginError").text("Please Enter Your First Name.");
            return;
        }

        if (!name) {
            $("#NewloginError").text("Please Enter Your Last Name.");
            return;
        }

        if (!email || !validateEmail(email)) {
            $("#NewloginError").text("Please Enter A Valid Email.");
            return;
        }
        if (!password || !validatePassword(password)) {
            $("#NewloginError").text("Password must be at least 6 characters long and contain at least one number.");
            return;
        }

        if (password !== confirmPassword) {
            $("#NewloginError").text("Passwords do not match.");
            return;
        }

        const formData = {
            lastName: name,
            email: email,
            firstname: fname,
            userpassword: password
        };

        $.ajax({
            url: '/api/WebApi/Register',
            type: 'POST',
            data: formData,
            success: function (response) {
                console.log("Signup successful", response);
                window.location.href = "/Login/Login";
            },
            error: function (xhr, status, error) {
                console.log(formData);
                console.error("Signup failed", error);
                $("#NewloginError").text("Signup failed. Please try again.");
            }
        });
    };

    function handleForgotPassword() {
        var email = $('#forgotEmail').val();

        // Validation
        if (!email) {
            $("#forgotPasswordMessage").text("Please enter your email.");
            return;
        }

        // AJAX call to handle password reset
        $.ajax({
            url: '/api/WebApi/ForgotPassword',
            type: 'POST',
            data: { email: email },
            success: function (response) {
                $("#forgotPasswordMessage").text("Password reset instructions sent to your email.");
                $('#forgotEmail').val(''); // Clear the input field
            },
            error: function (xhr, status, error) {
                $("#forgotPasswordMessage").text("Error resetting password. Please try again.");
            }
        });
    }

    $('#forgotPasswordLink').click(function (e) {
        e.preventDefault();
        $('#forgotPasswordForm').show();
    });

    $('#sendResetLinkBtn').click(function () {
        handleForgotPassword();
    });
});
