import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class Main {

    public static void main(String[] args) throws IOException {
        // יצירת שרת HTTP על פורט 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // ניתוב לדף סטטי
        server.createContext("/", new StaticPageHandler());

        // ניתוב לבקשות POST לשמירת סטודנט
        server.createContext("/addStudent", new AddStudentHandler());

        // הפעלת השרת
        server.start();
        System.out.println("Server started on port 8080");
    }

    // מחלקה שמטפלת בדף סטטי
    static class StaticPageHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String filePath = "pages/index.html";
            String response;

            try {
                response = Files.readString(Paths.get(filePath));
                exchange.getResponseHeaders().set("Content-Type", "text/html");
                exchange.sendResponseHeaders(200, response.getBytes().length);
            } catch (IOException e) {
                response = "File not found";
                exchange.sendResponseHeaders(404, response.getBytes().length);
            }

            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    // מחלקה שמטפלת בבקשות POST לשמירת סטודנט במסד הנתונים
    static class AddStudentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1); // שיטה לא נתמכת
                return;
            }

            // קריאת גוף הבקשה
            InputStream is = exchange.getRequestBody();
            String requestBody = new String(is.readAllBytes());
            is.close();

            // ניתוח נתונים (צפוי שהבקשה תשלח בפורמט "name=studentName")
            String[] params = requestBody.split("=");
            String studentName = params.length > 1 ? params[1] : null;

            if (studentName == null || studentName.isBlank()) {
                String response = "Invalid student name";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }

            // שמירת הסטודנט במסד הנתונים
            try {
                saveStudent(studentName);
            } catch (Exception e) {
                String response = "Failed to save student: " + e.getMessage();
                exchange.sendResponseHeaders(500, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }

            // שליחת תשובה ללקוח
            String response = "Student added successfully!";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }

        // פונקציה לשמירת סטודנט במסד הנתונים
        private void saveStudent(String name) throws Exception {
            String url = "jdbc:mysql://localhost:3306/sys";
            String user = "root";
            String password = "1991";

            Connection connection = DriverManager.getConnection(url, user, password);
            String sql = "INSERT INTO student (name) VALUES (?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, name);
            preparedStatement.executeUpdate();
            connection.close();
        }
    }
}
