import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatPanel = ({ messages, input, setInput, sendMessage, onInputKeyDown }) => {
  return (
    <Paper sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Chat
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: 320,
          maxHeight: 420,
          overflowY: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 1.5,
          bgcolor: "#fafcfe",
        }}
      >
        {messages.length === 0 ? (
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            No messages yet.
          </Typography>
        ) : (
          messages.map((m, i) => (
            <Box key={i} sx={{ mb: 1.2 }}>
              <Typography component="span" sx={{ fontWeight: 700 }}>
                {m.user}:
              </Typography>{" "}
              <Typography component="span">{m.msg}</Typography>
            </Box>
          ))
        )}
      </Box>

      <Stack direction="row" spacing={1.25} sx={{ mt: 1.5 }}>
        <TextField
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Type a message"
        />
        <Button variant="contained" onClick={sendMessage} sx={{ minWidth: 50 }}>
          <SendIcon fontSize="small" />
        </Button>
      </Stack>
    </Paper>
  );
};

export default ChatPanel;
