document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) return;
    const formData = new FormData();
    formData.append('csv.datei',fileInput.files);
    try { const response = await fetch('exportData.php', {
        method: 'GET',
        body: formData
    });
    const result = await response.json();
    console.log(result);
    } catch (error) { console.error('Error:', error); }

});

    
