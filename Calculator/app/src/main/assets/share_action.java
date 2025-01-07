// 하이브리드 앱 환경에서 HTML을 이미지로 변환하고, 변환된 이미지를 저장하고 관리하는 방법을 설명하겠습니다. 서버를 사용할 수 없는 상황이라면, 로컬 저장소(예: 파일 시스템)를 활용하여 이미지를 저장하고 관리할 수 있습니다. 안드로이드 하이브리드 앱에서는 JavaScript와 네이티브 코드 간의 상호작용을 통해 이러한 작업을 수행할 수 있습니다.
// 1. HTML을 이미지로 변환
// 먼저, html2canvas를 사용하여 HTML을 이미지로 변환하는 부분은 동일합니다.
// 2. 이미지 데이터를 로컬 파일로 저장
// 안드로이드 하이브리드 앱에서는 JavaScript와 네이티브 코드 간의 상호작용을 위해 WebView와 JavaScript 인터페이스를 사용할 수 있습니다. 이를 통해 JavaScript에서 생성된 이미지 데이터를 네이티브 코드로 전달하고, 네이티브 코드에서 로컬 파일로 저장할 수 있습니다.
// JavaScript 코드
Language:JAVASCRIPTdocument.getElementById('captureButton').addEventListener('click', function() {
    const element = document.getElementById('capture');

    html2canvas(element).then(canvas => {
        // 캔버스를 이미지 데이터 URL로 변환
        const imageDataURL = canvas.toDataURL('image/png');

        // 네이티브 코드로 이미지 데이터 URL 전달
        if (window.AndroidInterface) {
            window.AndroidInterface.saveImage(imageDataURL);
        } else {
            console.error('AndroidInterface is not available');
        }
    });
});

// 안드로이드 네이티브 코드 (Java)
// 안드로이드 네이티브 코드에서는 JavaScript 인터페이스를 설정하고, 전달된 이미지 데이터를 로컬 파일로 저장하는 기능을 구현합니다.

MainActivity.java:

Language:JAVApackage com.example.hybridapp;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import java.io.FileOutputStream;
import java.io.IOException;
import android.util.Base64;

public class MainActivity extends AppCompatActivity {
    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.webView);
        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.setWebViewClient(new WebViewClient());
        mWebView.addJavascriptInterface(new WebAppInterface(), "AndroidInterface");
        mWebView.loadUrl("file:///android_asset/index.html");
    }

    public class WebAppInterface {
        @JavascriptInterface
        public void saveImage(String imageDataURL) {
            // 이미지 데이터 URL에서 Base64 데이터 추출
            String base64Data = imageDataURL.split(",")[1];
            byte[] imageData = Base64.decode(base64Data, Base64.DEFAULT);

            // 로컬 파일로 저장
            try (FileOutputStream fos = openFileOutput("captured_image.png", MODE_PRIVATE)) {
                fos.write(imageData);
                fos.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}


activity_main.xml:

Language: XML
<? xml version = "1.0" encoding = "utf-8" ?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</RelativeLayout>


index.html (assets 폴더에 저장):

Language:HTML<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML to Image</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body>
    <div id="capture" style="width: 200px; height: 200px; background-color: lightblue;">
        <h1>Hello, World!</h1>
    </div>
    <button id="captureButton">Capture and Save</button>
    <script>
        document.getElementById('captureButton').addEventListener('click', function() {
            const element = document.getElementById('capture');

            html2canvas(element).then(canvas => {
                // 캔버스를 이미지 데이터 URL로 변환
                const imageDataURL = canvas.toDataURL('image/png');

                // 네이티브 코드로 이미지 데이터 URL 전달
                if (window.AndroidInterface) {
                    window.AndroidInterface.saveImage(imageDataURL);
                } else {
                    console.error('AndroidInterface is not available');
                }
            });
        });
    </script>
</body>
</html>

// 설명


// JavaScript 코드:

// html2canvas를 사용하여 HTML 요소를 캡처하고, 캔버스를 이미지 데이터 URL로 변환합니다.
// 변환된 이미지 데이터를 window.AndroidInterface.saveImage 메서드를 통해 네이티브 코드로 전달합니다.



// 안드로이드 네이티브 코드:

// WebView를 설정하고, JavaScript 인터페이스를 추가합니다.
// saveImage 메서드에서 이미지 데이터 URL을 Base64로 디코딩하여 로컬 파일로 저장합니다.



// 이 방법을 사용하면 하이브리드 앱에서 HTML을 이미지로 변환하고, 변환된 이미지를 로컬 파일로 저장할 수 있습니다. 앱이 종료되더라도 로컬 파일에 저장된 이미지는 유지됩니다. 앱을 삭제하지 않는 한, 저장된 이미지는 계속 유효합니다.
