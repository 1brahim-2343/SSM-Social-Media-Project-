import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { useQuery } from "@tanstack/react-query";

import { getPosts, getPostsBySearch } from "../features/posts/api/postsApi";
import { useAuthStore } from "../features/auth/store/authStore";

import CreatePostCard from "../components/CreatePostCard";
import PostCard from "../components/PostCard";
import NotificationsMenu from "../features/notifications/components/NotificationsMenu";
import { useSearchParams } from "react-router-dom";
import { getOnlineUsers } from "../features/friends/api/friendsApi";
import PeopleCard from "../features/friends/components/PeopleCard";

export default function FeedPage() {
  const user = useAuthStore((state) => state.user);

  const [searchParams] = useSearchParams();

  const searchWord = searchParams.get("search") ?? " ";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", searchWord],

    queryFn: () =>
      getPostsBySearch({
        search: searchWord,
        page: 1,
        pageSize: 20,
      }),
  });

  const onlineUsersQuery = useQuery({
    queryKey: ["onlineUsers"],

    queryFn: () => getOnlineUsers(),
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fc",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "240px minmax(0, 680px)",
              lg: "240px minmax(0, 680px) 300px",
            },
            gap: 3,
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                position: "sticky",
                top: 96,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={1.2}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                >
                  Navigation
                </Typography>

                <Typography fontWeight={700}>Home</Typography>

                <Typography color="text.secondary">Friends</Typography>

                <Typography color="text.secondary">Messages</Typography>

                <Typography color="text.secondary">Notifications</Typography>
              </Stack>
            </Paper>
          </Box>

          <Stack spacing={2.5}>
            <CreatePostCard />

            {isLoading &&
              [1, 2, 3].map((item) => (
                <Paper
                  key={item}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                    }}
                  >
                    <Skeleton variant="circular" width={46} height={46} />

                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="30%" />
                      <Skeleton width="20%" />
                    </Box>
                  </Box>

                  <Skeleton height={24} sx={{ mt: 2 }} />

                  <Skeleton height={24} width="75%" />
                </Paper>
              ))}

            {isError && (
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                }}
              >
                <Typography color="error">Feed could not be loaded.</Typography>
              </Paper>
            )}

            {data?.items?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Stack>

          <Box
            sx={{
              display: {
                xs: "none",
                lg: "block",
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                position: "sticky",
                top: 96,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontWeight={800} mb={2}>
                Contacts
              </Typography>

              <Box color="text.secondary" component="div">
                {onlineUsersQuery.data?.map((user) => (
                  <Box
                    key={user.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1,
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={user.profileImageUrl}
                        sx={{ width: 36, height: 36 }}
                      >
                        {user.firstName?.[0]}
                      </Avatar>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: "#22c55e",
                          border: "2px solid",
                          borderColor: "background.paper",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {`${user.firstName} ${user.lastName}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {`@${user.userName}`}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
