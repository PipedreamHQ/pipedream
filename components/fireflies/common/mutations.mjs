export default {
  uploadAudio: `
    mutation($input: AudioUploadInput) { 
      uploadAudio(input: $input) { 
        success 
        title 
        message 
      } 
    }
  `,
};
