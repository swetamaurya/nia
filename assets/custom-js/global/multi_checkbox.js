// multi_checkbox.js

// Return an array of _id for all checked child checkboxes
export function r_arr1() {
    let arr1 = [];
    Array.from(document.querySelectorAll(".checkbox_child")).forEach((e) => {
      if (e.checked) {
        arr1.push(e.value);
      }
    });
    return arr1;
  }
  
  // Uncheck all checkboxes
  export function u_arr1() {
    const allBox = document.querySelector(".checkbox_all");
    if (allBox) allBox.checked = false;
    Array.from(document.querySelectorAll(".checkbox_child")).forEach((e) => {
      e.checked = false;
    });
  }
  
  // Primary function to handle "Select All" logic
  export function checkbox_function() {
    try {
      // "Select All" on top
      const selectAllBox = document.querySelector(".checkbox_all");
      if (selectAllBox) {
        selectAllBox.addEventListener("change", function () {
          if (this.checked) {
            Array.from(document.querySelectorAll(".checkbox_child")).forEach(
              (e) => (e.checked = true)
            );
            enableBtns();
          } else {
            Array.from(document.querySelectorAll(".checkbox_child")).forEach(
              (e) => (e.checked = false)
            );
            disableBtns();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  
    try {
      // Each child checkbox
      const childBoxes = document.querySelectorAll(".checkbox_child");
      childBoxes.forEach((box) => {
        box.addEventListener("change", function () {
          let allChecked = true;
          let anyChecked = false;
  
          childBoxes.forEach((cb) => {
            if (!cb.checked) {
              allChecked = false;
            } else {
              anyChecked = true;
            }
          });
  
          // If all child are checked => .checkbox_all is also checked
          const selectAll = document.querySelector(".checkbox_all");
          if (selectAll) {
            selectAll.checked = allChecked;
          }
  
          // If at least one is checked, enable buttons, else disable
          if (anyChecked) {
            enableBtns();
          } else {
            disableBtns();
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  // Enable the "Download" and "Remove" buttons
  export function enableBtns() {
    ["delete_btn_multiple_file", "download_excel_multiple_file"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.remove("disabled");
    });
  }
  
  // Disable the "Download" and "Remove" buttons
  export function disableBtns() {
    ["delete_btn_multiple_file", "download_excel_multiple_file"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.add("disabled");
    });
  }
  