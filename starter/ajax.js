var empty;

function update_globals() {
  // Labels

  empty = $("#empty").val();
  $("#label_empty").html("");
  $("#empty").removeClass("border-danger");
}

// AJAX with JQuery >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

async function query_() {
  update_globals();

  form_data = new FormData();

  form_data.append("empty", empty);

  set_loading_spinner("btn_empty");
  url = "empty";
  ajax_response = await ajax_request_jquery(url, form_data);
  release_loading_spinner("btn_empty");

  console.log(ajax_response);
  // >>>>>>>>>>>>>> Response
  const success_response = () => {
    _display_success_server_res_msg(
      "Successful",
      `  <br> Finalizing  <br> <br> <span class="spinner-border spinner-border sm">`,
      "success"
    );
  };
  display_ajax_response(ajax_response, success_response);
}

// AJAX with Vanila JS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// async function query_() {
//   update_globals();

//   var ajax_url = "/empty";
//   data = `empty=${empty}&empty=${empty}`;

//   set_loading_spinner("loader_empty");
//   ajax_response = await ajax_request(ajax_url, data);
//   release_loading_spinner("loader_empty");

//   console.log(ajax_response);
//   // >>>>>>>>>>>>>> Response
//   const success_response = () => {
//     _display_success_server_res_msg("Successful", `  <br> Finalizing  <br> <br> <span class="spinner-border spinner-border sm">`, "success");
//   };
//   display_ajax_response(ajax_response, success_response);
//   // >>>>>>>>>>>>>>
// }

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
