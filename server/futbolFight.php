<?php
require __DIR__ . '/config.php';
// Check if the required parameters are set
if (isset($_GET['param1']) && isset($_GET['param2'])) {
    $param1 = $_GET['param1'];
    $param2 = $_GET['param2'];
    $param3 = $_GET['param3'];

    // Set the topic based on param2
    $topic = ($param2 !== "All") ? $param2 . " team" : $param1 . " league";

    // Set the timeframe based on param3
    $timeframe = $param3;

    // URL to fetch data from, with parameters

    $prompt = "Pretend you are a middle-aged man who has been watching football for a long time. You are in a pub. Give me a juicy, argument-worthy topic about the team $param2 in the $param1 league in the $param3 season that would get football fans debating passionately. It should be something spicy like 'Was Player A overrated compared to Player B?' or 'Was Team A's dominance actually a fluke?' or 'Which game defined that era?' Keep it concise, provocative, and in the form of a question that would spark a proper pub argument.";    // Initialize a cURL session
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
            ["role" => "user", "content" => $prompt]
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
