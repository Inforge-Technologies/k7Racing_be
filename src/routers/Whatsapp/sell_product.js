const categoryService = require("../../services/mst_categories.service");
const subCategoryService = require("../../services/trn_subcategories.service");
const constants = require("../../constants/whatsapp_text");
const prdService = require("../../services/trn_product.service");

async function sellProduct(data, localStorage, Whatsapp) {
    localStorage.setItem('buyorsell', 2);
  
    if(localStorage.setItem('sellStep') =="1"){
    }
}