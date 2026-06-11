<?php
require __DIR__ . '/config.php';
// Check if the required parameters are set
if (isset($_GET['param1'])) {
    $param1 = $_GET['param1'];


    // Set the topic based on param2
    $topic = $param1 . " Provide an answer to the question in a concise sentence.";

    // URL to fetch data from, with parameters

    // Initialize a cURL session
    $ch = curl_init("https://api.openai.com/v1/chat/completions");  

    // Set the necessary headers
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer " . OPENAI_API_KEY
    ]);

    // Set the POST fields
    $data = [
        "model" => "gpt-4o-mini",
        "messages" => [
            ["role" => "user", "content" => $topic, "temperature" => 1.8, "frequency_penalty" => 1, "presence_penalty" => 1]
        ]
    ];
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    // Set the option to return the response as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute the cURL session and fetch the response
    $response = curl_exec($ch);

    // Check for cURL errors
if ($response === false) {
    echo "cURL Error: " . curl_error($ch);
} else {
    // Decode the JSON response
    $responseData = json_decode($response, true);

    // Check if the response contains the expected structure
    if (isset($responseData['choices'][0]['message']['content'])) {
        // Output the content
        echo $responseData['choices'][0]['message']['content'];
    } else {
        echo "Error: Unexpected response structure.";
    }
}

    // Close the cURL session
    curl_close($ch);
} else {
    echo "Error: Missing parameters.";
}
?>
