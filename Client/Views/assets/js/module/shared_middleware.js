export const connectionInstance = axios.create({
  withCredentials: true,
  baseURL: "http://getdrunk.ml/",
  headers: {
    Accept: "application/json",
  },
});

export const secret_key = "jlFO445Jfd5s1f5s431fsd5w789es15O";

export function validateInputEmailPassword(e, p) {
  var email_regex =
    /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var password_regex1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

  if (email_regex.test(e) == false) {
    return false;
  } else if (p.length < 8 || password_regex1.test(p) == false) {
    return false;
  } else {
    return true;
  }
}

export function validateInputNameEmailPasswordPhone(n, e, p, no) {
  var email_regex =
    /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  var name_regex = /^[a-zA-Z]+$/;
  var phone_regex = /^[89]\d{7}$/;

  if (email_regex.test(e) == false) {
    return false;
  } else if (p.length < 8 || password_regex.test(p) == false) {
    return false;
  }
  if (name_regex.test(n) == false) {
    return false;
  }
  if (phone_regex.test(no) == false) {
    return false;
  } else {
    return true;
  }
}

connectionInstance.interceptors.request.use(
  (config) => {
    const tk = localStorage.getItem("sessionToken");
    if (tk) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${tk}`,
      };
    }
    if (config.headers["Content-Type"] == undefined) {
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const urlArray = {
  post: [
    "/api/login",
    "/api/verifyOTP",
    "/api/refreshToken",
    "/api/revokeRefreshTokens",
  ],
  get: ["/api/isAuthenticated"],
};
connectionInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async function (err) {
    const oriReq = err.config;
    if (err.response.status == 401) {
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("role");

      if (urlArray[oriReq.method].includes(oriReq.url)) {
        if (oriReq.method == "post" && oriReq.url == "/api/refreshToken") {
          window.location.replace("/login");
          return Promise.reject(err);
        } else {
          return Promise.reject(err);
        }
      }
      try {
        const response = await connectionInstance.post(
          "/api/refreshToken",
          {},
          {}
        );
        localStorage.setItem("sessionToken", response.data.data);
        return connectionInstance(oriReq);
      } catch (error) {}
    } else if (err.response.status == 403) {
      window.location.replace("/error403");
    } else if (err.response.status == 500) {
      window.location.replace("/error500");
    } else if (err.response.status == 404) {
      window.location.replace("/error404");
    }
    return Promise.reject(err);
  }
);

var acceptedCreditCards = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard:
    /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  amex: /^3[47][0-9]{13}$/,
  discover:
    /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
  diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
};

export function checkSupported(value) {
  // remove all non digit characters
  var value = value.replace(/\D/g, "");
  var accepted = false;

  // loop through the keys (visa, mastercard, amex, etc.)
  Object.keys(acceptedCreditCards).forEach(function (key) {
    var regex = acceptedCreditCards[key];
    if (regex.test(value)) {
      accepted = true;
    }
  });

  return accepted;
}

export function validateCard(value) {
  // remove all non digit characters
  var value = value.replace(/\D/g, "");
  var sum = 0;
  var shouldDouble = false;
  // loop through values starting at the rightmost side
  for (var i = value.length - 1; i >= 0; i--) {
    var digit = parseInt(value.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  var valid = sum % 10 == 0;
  var accepted = false;

  // loop through the keys (visa, mastercard, amex, etc.)
  Object.keys(acceptedCreditCards).forEach(function (key) {
    var regex = acceptedCreditCards[key];
    if (regex.test(value)) {
      accepted = true;
    }
  });

  return valid && accepted;
}

export function validateInputName(n) {
  var name_regex = /^[a-zA-Z]+$/;

  if (name_regex.test(n) == false) {
    return false;
  } else {
    return true;
  }
}

export default connectionInstance;
