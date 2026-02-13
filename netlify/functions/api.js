exports.handler = async function(event, context) {
    const { action, login, domain, id } = event.queryStringParameters;
    
    // Base URL 1secmail
    let url = `https://www.1secmail.com/api/v1/?action=${action}&login=${login}&domain=${domain}`;
    
    if (id) {
        url += `&id=${id}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // Mengizinkan akses dari mana saja
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Gagal mengambil data dari server email" })
        };
    }
};
