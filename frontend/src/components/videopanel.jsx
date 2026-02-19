import { Box, Grid, Typography } from "@mui/material";

const VideoPanel = ({ localVideoRef, remoteUsers }) => {
  const totalVideos = 1 + remoteUsers.length;
  const tileSize =
    totalVideos === 1
      ? { xs: 12 }
      : totalVideos === 2
        ? { xs: 12, md: 6 }
        : totalVideos <= 4
          ? { xs: 12, sm: 6, md: 6 }
          : { xs: 12, sm: 6, md: 4 };

  return (
    <Grid container spacing={2}>
      <Grid size={tileSize}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
          You
        </Typography>
        <Box
          component="video"
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          sx={{
            width: "100%",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "#0f172a",
            aspectRatio: "16 / 10",
            objectFit: "cover",
          }}
        />
      </Grid>

      {remoteUsers.map((remoteUser) => (
        <Grid key={remoteUser.socketId} size={tileSize}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
            {remoteUser.username}
          </Typography>
          <Box
            component="video"
            autoPlay
            playsInline
            ref={(el) => {
              if (!el || !remoteUser.stream) return;
              if (el.srcObject !== remoteUser.stream) {
                el.srcObject = remoteUser.stream;
              }
              el.play().catch(() => {});
            }}
            sx={{
              width: "100%",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "#0f172a",
              aspectRatio: "16 / 10",
              objectFit: "cover",
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoPanel;
