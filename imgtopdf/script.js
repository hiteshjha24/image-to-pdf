document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
document.getElementById('downloadPDF').addEventListener('click', downloadPDF);

function handleImageUpload(event) {
    const files = event.target.files;
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.onload = function() {
                imagePreview.appendChild(img);
            };
        }

        reader.readAsDataURL(file);
    }
}

async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const images = document.querySelectorAll('#imagePreview img');

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        const canvas = document.createElement('canvas');
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, imgWidth, imgHeight);
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

        if (i > 0) {
            pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save('images.pdf');
}
