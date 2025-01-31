import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  IconButton,
  Fab,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from './Header';
import EditChat from './EditChat';

const ChatList = ({
  chats,
  activeChat,
  onChatClick,
  onNewChat,
  onEditChat,
  onDeleteChat,
  error,
  setError
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleMenuClick = (event, chat) => {
    event.stopPropagation();
    setSelectedChat(chat);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDeleteChat(selectedChat.id);
    handleMenuClose();
  };

  const handleSaveEdit = (editedChat) => {
    onEditChat(editedChat);
    setEditDialogOpen(false);
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 320 },
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Header title="Chats" />
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            disablePadding
            secondaryAction={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                  {chat.messages[chat.messages.length - 1]?.time}
                </Typography>
                <IconButton
                  edge="end"
                  onClick={(e) => handleMenuClick(e, chat)}
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemButton
              selected={activeChat?.id === chat.id}
              onClick={() => onChatClick(chat)}
              sx={{ pl: 2 }}
            >
              <ListItemText
                primary={chat.name}
                secondary={chat.lastMessage}
                primaryTypographyProps={{
                  variant: 'subtitle1',
                  color: 'text.primary'
                }}
                secondaryTypographyProps={{
                  variant: 'body2',
                  color: 'text.secondary',
                  noWrap: true
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Fab
          color="primary"
          onClick={onNewChat}
          disabled={chats.length >= 5}
          size="medium"
        >
          <AddIcon />
        </Fab>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {selectedChat && (
        <EditChat
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          chat={selectedChat}
          onSave={handleSaveEdit}
          chats={chats}
        />
      )}
    </Box>
  );
};

export default ChatList;
