// ********************************** We can use  This code is for by ID *********************************
(function ($) {
  var fileUploadCount = 0;

  $.fn.fileUpload = function () {
    return this.each(function () {
      var fileUploadDiv = $(this);
      var fileUploadId = `fileUpload-${++fileUploadCount}`;

      // Dynamically generate content based on the container's ID
      var fileDivContent = "";
      if (fileUploadDiv.attr("id") === "photo_path") {
        fileDivContent = `
                    <label for="${fileUploadId}" class="file-upload image-upload__box">
                        <div class="image-upload__boxInner">
                            <i class="ph ph-image mb-8 image-upload__icon"></i>
                            <h5 class="mb-4 text-primary">Upload Photo</h5>
                            <p class="text-13">PNG, JPEG (max 5mb size)</p>
                        </div>
                        <input type="file" id="${fileUploadId}" name="photo[]"  hidden accept="image/png, image/jpeg, image/gif, image/bmp, image/svg+xml" />
                    </label>
                `;
      } else if (fileUploadDiv.attr("id") === "signature_path") {
        fileDivContent = `
                    <label for="${fileUploadId}" class="file-upload image-upload__box">
                        <div class="image-upload__boxInner">
                            <i class="ph ph-signature mb-8 image-upload__icon"></i>
                            <h5 class="mb-4 text-primary">Upload Signature</h5>
                            <p class="text-13">PNG, JPEG (max 2mb size)</p>
                        </div>
                        <input type="file" id="${fileUploadId}" name="signature[]"  hidden accept="image/png, image/jpeg, image/gif, image/bmp, image/svg+xml" />
                    </label>
                `;
      } else {
        // Default fallback for other IDs or general cases
        fileDivContent = `
                    <label for="${fileUploadId}" class="file-upload image-upload__box">
                        <div class="image-upload__boxInner">
                            <i class="ph ph-image mb-8 image-upload__icon"></i>
                            <h5 class="mb-4 text-primary">Upload Thumbnail</h5>
                            <p class="text-13">PNG, JPEG (max 5mb size)</p>
                        </div>
                        <input type="file" id="${fileUploadId}" name="[]" hidden accept="image/png, image/jpeg, image/gif, image/bmp, image/svg+xml" />
                    </label>
                `;
      }

      fileUploadDiv.html(fileDivContent).addClass("file-container");

      // Handles uploaded file details
      function handleFiles(files) {
        if (files.length > 0) {
          var file = files[0]; // Assuming only one file is selected

          var fileName = file.name;
          var fileSize = (file.size / 1024).toFixed(2) + " KB";
          var fileType = file.type;
          var preview = fileType.startsWith("image")
            ? `<img src="${URL.createObjectURL(
                file
              )}" alt="${fileName}" class="image-upload__image" style="width: 180px;height: 174px;">`
            : `<span class="image-upload__anotherFileIcon"><i class="fas fa-file"></i></span>`;

          // Update the file upload area
          var fileUploadLabel = fileUploadDiv.find(`label.file-upload`);
          fileUploadLabel.find(".image-upload__boxInner").html(`
                        ${preview}
                        <button type="button" class="image-upload__deleteBtn"><i class="ph ph-x"></i></button>
                    `);

          // Add delete functionality
          fileUploadLabel.find(".image-upload__deleteBtn").click(function () {
            fileUploadDiv.html(fileDivContent);
            initializeFileUpload();
          });
        }
      }

      function initializeFileUpload() {
        // Handle drag-and-drop events
        fileUploadDiv.on({
          dragover: function (e) {
            e.preventDefault();
            fileUploadDiv.toggleClass("dragover", e.type === "dragover");
          },
          drop: function (e) {
            e.preventDefault();
            fileUploadDiv.removeClass("dragover");
            handleFiles(e.originalEvent.dataTransfer.files);
          },
        });

        // Handle file selection
        fileUploadDiv
          .find(`label.file-upload input[type="file"]`)
          .change(function () {
            handleFiles(this.files);
          });
      }

      initializeFileUpload();
    });
  };
})(jQuery);

// Apply fileUpload functionality to each container with the class "fileUpload"
$(".fileUpload").fileUpload();
$("#photo_path").fileUpload();
$("#signature_path").fileUpload();
