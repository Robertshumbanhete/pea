// Search for item in db
query_record_existance(table, column, value);

// AI Response
response_obj = { success: true, msg: "Success",  };

response_obj = { success: false, msg: "Failed!" };

response_obj = { success: false, msg: "Empty", data: { label_id: "label_", input_id: "Empty" } };

// >>>>>>>>>>>>>>>>>>>>>>>
const empty = <%- JSON.stringify(locals.empty) || `0` %>

await global_obj.get_select(table, column )
 
const select_categories =  <%- JSON.stringify(locals.select_categories) || `[]` %>;

select_categories.forEach(element => {
  document.write(`<option value="${element.id}">${element.name}</option>`);
});
 

// Highlight errors from ajax request on input and label
highlight_input_error(ajax_response.data.label_id, ajax_response.msg, ajax_response.data.input_id);

_trigger_sweet_alert(title, text, icon);

_display_success_server_res_msg('Successful', `  <br> Finalizing  <br> <br> <span class="spinner-border spinner-border sm">`, 'success');


var response_obj;
// validation
if (validation_obj.check_empty_string(address_line1 )) {
  response_obj = { success: false, msg: "Field must be at least two characters!", data: {  input_id: "address_line1" ,label_id: "label_address_line1"} };
} else if (!(await validation_obj.query_record_existance("gc_countries", "id", address_country))) {
  response_obj = { success: false, msg: "Invalid Country!",  data: {  input_id: "address_country",label_id: "label_address_country" } };
} else {
  response_obj = { success: true, msg: "Success!" };
}

res.send(response_obj);
 
const empty = <%- JSON.stringify(locals.empty) || `[]` %>;

empty.forEach(element => {
document.write(`<option value="${element.id}">${element.code}</option>`);
});

//  >>>>>>>>>>>>FILES<<<<<<<<<<<<<<<<<<<<<
file = req.files.file;
data = file.data;
var workbook = XLSX.read(data);
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

formatCurrency(value) 


// Remove autofill
readonly onfocus="this.removeAttribute('readonly');" onblur="this.setAttribute('readonly','');"


// WaterMark
<p class="watermark_image   fw-boldest text-danger" id="void_text"> </p>


// Get Params
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('constituency');

  if(myParam){
   search_string += `(<span class="fw-bolder">Constituency</span>: ${myParam} )`;
  }
 
  if(search_string){
    $('#constituency_id').val(myParam); 

    $('#search_string').html(search_string + '<a href="/statistics" class="text-primary text-hover-dark fs-8 ms-2">(Clear)</a>');
  }


