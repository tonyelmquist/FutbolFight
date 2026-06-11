<?php
require __DIR__ . '/config.php';
// Check if the required parameters are set
if (isset($_GET['param1']) && isset($_GET['param2']) && isset($_GET['param3'])) {
    $param1 = $_GET['param1'];
    $param2 = $_GET['param2'];
    $param3 = $_GET['param3'];

    // Set the timeframe based on param3
    $timeframe = $param3;

    // URL to fetch data from, with parameters

    $prompt = "Give me an argument-worthy topic about the team $param2 in the $param3 season that would get football (soccer) fans debating passionately. It can include any knowledge you have about the teams, players, and games in that season to make it more interesting, including any controversial plays, moments, or events, or questions about which player was better than another player, or which game was the best game, or who was the most important player that seasion. Keep it concise, provocative, and in the form of a question that would spark a proper pub argument. Return just the question, no other text.";    // Initialize a cURL session

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
            ["role" => "user", "content" => $prompt, "temperature" => 1.8, "frequency_penalty" => 1, "presence_penalty" => 1]
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
