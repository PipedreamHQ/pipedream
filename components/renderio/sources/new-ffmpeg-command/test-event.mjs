export default {
  command_id: "cmd-550e8400-e29b-41d4-a716-446655440001",
  status: "processing",
  ffmpeg_command: "-i {{in_video}} -c:v libx264 {{out_video}}",
  input_files: {
    in_video: "https://example.com/input.mp4",
  },
  output_files: {
    out_video: "output.mp4",
  },
  created_at: "2025-01-01T00:00:00.000Z",
};
