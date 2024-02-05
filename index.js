const { google } = require("googleapis");

exports.handler = async (event) => {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: event.client_email,
            private_key: event.private_key.replace(/\\n/g, "\n"),
        },
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    try {
        const client = await auth.getClient();
        const googleSheet = google.sheets({
            version: "v4",
            auth: client,
        });
        const getRows = await googleSheet.spreadsheets.values.get({
            auth,
            spreadsheetId: event.spreadsheetId,
            range: event.range,
        });

        /*    const values = [
          ["Dato1", "Dato2", "Dato3", "Dato1", "Dato2", "Dato3", "dato"],
          ["Dato4", "Dato5", "Dato6", "Dato1", "Dato2", "Dato3", "dato"],
          ...Agrega más filas según sea necesario.
        ];*/

        const appendData = await googleSheet.spreadsheets.values.append({
            spreadsheetId: event.spreadsheetId,
            range: event.range,
            valueInputOption: "RAW", // Puedes especificar el formato de los datos.
            insertDataOption: "INSERT_ROWS", // Puedes ajustar esta opción según tus necesidades.
            resource: {
                values: event.data,
            },
        });
        if (appendData.status === 200) {
            return {
                status: appendData.status,
                body: {
                    message: "Ok",
                },
            };
        } else {
            return {
                status: appendData.status,
                body: {
                    message: "error",
                },
            };
        }
    } catch (error) {
        console.error(error);
        return {
            status: 400,
            body: {
                message: "error",
            },
        };
    }
};
