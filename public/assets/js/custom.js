function ajax_request(url, data) {
  return new Promise((resolve, reject) => {
    //AJAX REQUEST
    var xhr = new XMLHttpRequest();

    // Making the connection
    xhr.open("POST", url, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // function execute after request is successful
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        try {
          resolve(JSON.parse(this.response));
        } catch (error) {
          resolve({ success: false, msg: "Client Error. Error EE01" });
        }
      }
    };
    // Sending   request
    xhr.send(data);
  });
}

function ajax_request_jquery(url, form_data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "post",
      data: form_data,
      contentType: false,
      processData: false,

      success: function (data) {
        try {
          if (typeof data !== "object") {
            resolve({ success: false, msg: "Server Error. Error EE02" });
          } else if (data) {
            resolve(data);
          } else {
            resolve({ success: false, msg: "Client Error. Error EE01" });
          }
        } catch (error) {
          resolve({ success: false, msg: "Client Error. Error EE01" });
        }
      },
    });
  });
}

function _enable_btn(btn_id, label) {
  $(`#${btn_id}`).html(`<span class="indicator-label" > ${label}  </span>`);
  $(`#${btn_id}`).removeClass("disabled");
}

function _disable_btn(btn_id, label) {
  $(`#${btn_id}`).html(`${label} <span class="spinner-border spinner-border-sm align-middle ms-2"></span>`);
  $(`#${btn_id}`).addClass("disabled");
}

function _trigger_sweet_alert(title, text, icon) {
  $(document).ready(() => {
    Swal.fire({
      title: title,
      html: `<div class=" fw-normal fs-4">${text}</div>`,
      icon: icon,
      buttonsStyling: false,
      confirmButtonText: "Close",
      customClass: {
        confirmButton: "btn btn-primary",
      },
    });
  });
}

function set_loading_spinner(id) {
  $(`#${id}`).html('<span class="spinner-border spinner-border-sm align-middle ms-2"></span>');
}

function release_loading_spinner(id) {
  $(`#${id}`).html("");
}

// blockUI
var target = null;
var blockUI = null;

function constructor_blockUI(elemnt_id) {
  if (target === null || blockUI === null) {
    target = document.getElementById(elemnt_id);

    blockUI = new KTBlockUI(target, {
      message: '<div class="blockui-message"><span class="spinner-border text-primary"></span> Processing...</div>',
      overlayClass: "bg-primary bg-opacity-25",
    });
  }
}

function block_UI() {
  if (target !== null || blockUI !== null) {
    blockUI.block();
  }
}

function release_UI() {
  if (target !== null || blockUI !== null) {
    blockUI.release();
  }
}
// End Block UI

function highlight_input_error(label_id, label_text, input_id) {
  $(`#${label_id}`).html(`${label_text}`);
  $(`#${input_id}`).addClass(`border-danger`);
}

// breadcrumb
function display_breadcrumb(text) {
  $("#breadcrumb").html(text);
}

function get_date_only(date) {
  try {
    date = new Date(date);

    yyyy = date.getFullYear();
    mm = date.getMonth() + 1;
    dd = date.getDate();

    if (mm < 10 && mm > 0) {
      mm = `0${mm}`;
    }
    if (dd < 10 && dd > 0) {
      dd = `0${dd}`;
    }

    result = `${yyyy}-${mm}-${dd}`;
  } catch (error) {
    result = 0;
  }

  return result;
}

function _display_success_server_res_msg(title, text, icon) {
  _trigger_sweet_alert(title, text, icon);

  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

function display_ajax_response(ajax_response, success_response) {
  if (ajax_response.success) {
    success_response();
  } else {
    if (ajax_response.data) {
      highlight_input_error(ajax_response.data.label_id, ajax_response.msg, ajax_response.data.input_id);
    } else {
      if (ajax_response.msg) {
        _trigger_sweet_alert("Failed", ajax_response.msg, "info");
      } else {
        _trigger_sweet_alert("Failed", "Server Error", "error");
      }
    }
  }
}
