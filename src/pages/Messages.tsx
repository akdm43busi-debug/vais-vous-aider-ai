import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  Check, 
  CheckCheck,
  Phone,
  Video,
  ChevronLeft,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/store';
import { Member, Conversation, Message } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const association = storage.getAssociation();

  useEffect(() => {
    const loadedMembers = storage.getMembers();
    setMembers(loadedMembers);
    
    const user = storage.getCurrentUser() || { id: '1', name: 'Jean Dupont' };
    setCurrentUser(user);

    const loadedConversations = storage.getConversations();
    setConversations(loadedConversations);

    if (loadedConversations.length > 0) {
      setActiveConversationId(loadedConversations[0].id);
    }
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      const loadedMessages = storage.getMessages(activeConversationId);
      setMessages(loadedMessages);
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  const getConversationDetails = (conv: Conversation) => {
    if (conv.isGroup) {
      return {
        name: conv.name || 'Groupe',
        avatar: conv.avatar,
        initials: (conv.name || 'G').substring(0, 2).toUpperCase()
      };
    }
    
    const otherParticipantId = conv.participantIds.find(id => id !== currentUser?.id);
    const member = members.find(m => m.id === otherParticipantId);
    
    return {
      name: member ? `${member.firstName} ${member.lastName}` : 'Inconnu',
      avatar: member?.photo,
      initials: member ? `${member.firstName[0]}${member.lastName[0]}`.toUpperCase() : '?'
    };
  };

  const handleSendMessage = () => {
    const { status } = storage.getSubscriptionStatus();
    if (status === 'expired') {
      toast.error('Votre abonnement est expiré. Veuillez souscrire à une offre pour continuer.');
      return;
    }

    if (!newMessage.trim() || !activeConversationId || !currentUser) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      conversationId: activeConversationId,
      text: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    const updatedMessages = [...storage.getMessages(), message];
    storage.saveMessages(updatedMessages);
    setMessages(updatedMessages.filter(m => m.conversationId === activeConversationId));
    setNewMessage('');

    // Update conversation last message
    const updatedConversations = conversations.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          lastMessage: message.text,
          lastMessageTimestamp: message.timestamp
        };
      }
      return c;
    });
    
    // Sort conversations by latest message
    const sortedConversations = [...updatedConversations].sort((a, b) => {
      const timeA = new Date(a.lastMessageTimestamp || 0).getTime();
      const timeB = new Date(b.lastMessageTimestamp || 0).getTime();
      return timeB - timeA;
    });

    storage.saveConversations(sortedConversations);
    setConversations(sortedConversations);
  };

  const filteredConversations = conversations.filter(conv => {
    const details = getConversationDetails(conv);
    return details.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background border rounded-lg overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-80 border-r flex flex-col bg-card",
        activeConversationId && "hidden md:flex"
      )}>
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold">Messages</h1>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conv) => {
              const details = getConversationDetails(conv);
              const isActive = activeConversationId === conv.id;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left",
                    isActive ? "bg-primary/10" : "hover:bg-muted"
                  )}
                >
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={details.avatar} alt={details.name} />
                    <AvatarFallback>{details.initials}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold truncate">{details.name}</span>
                      {conv.lastMessageTimestamp && (
                        <span className="text-[10px] text-muted-foreground uppercase">
                          {format(new Date(conv.lastMessageTimestamp), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate italic">
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge className="h-5 min-w-5 flex items-center justify-center rounded-full px-1">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-muted/20",
        !activeConversationId && "hidden md:flex items-center justify-center"
      )}>
        {activeConversationId ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setActiveConversationId(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Avatar className="h-10 w-10 border">
                  <AvatarImage 
                    src={getConversationDetails(activeConversation!).avatar} 
                    alt={getConversationDetails(activeConversation!).name} 
                  />
                  <AvatarFallback>
                    {getConversationDetails(activeConversation!).initials}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-sm font-semibold">
                    {getConversationDetails(activeConversation!).name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">En ligne</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Video className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages List */}
            <ScrollArea className="flex-1 p-4 bg-[url('https://w0.peakpx.com/wallpaper/508/446/HD-wallpaper-whatsapp-l-background-doodle-pattern-thumbnail.jpg')] bg-repeat">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <p className="text-sm">Aucun message pour le moment.</p>
                    <p className="text-xs">Commencez la conversation !</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const prevMsg = index > 0 ? messages[index - 1] : null;
                    const showDate = !prevMsg || 
                      format(new Date(msg.timestamp), 'yyyy-MM-dd') !== format(new Date(prevMsg.timestamp), 'yyyy-MM-dd');

                    return (
                      <div key={msg.id} className="space-y-4">
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] font-semibold text-muted-foreground uppercase shadow-sm">
                              {format(new Date(msg.timestamp), 'd MMMM yyyy', { locale: fr })}
                            </span>
                          </div>
                        )}
                        <div className={cn(
                          "flex w-full",
                          isMe ? "justify-end" : "justify-start"
                        )}>
                          <div className={cn(
                            "max-w-[80%] rounded-2xl px-3 py-2 shadow-sm relative",
                            isMe 
                              ? "bg-primary text-primary-foreground rounded-tr-none" 
                              : "bg-card text-foreground rounded-tl-none border"
                          )}>
                            <p className="text-sm leading-relaxed mb-1 whitespace-pre-wrap">{msg.text}</p>
                            <div className={cn(
                              "flex items-center justify-end gap-1 text-[9px]",
                              isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              <span>{format(new Date(msg.timestamp), 'HH:mm')}</span>
                              {isMe && (
                                <>
                                  {msg.status === 'sent' && <Check className="h-3 w-3" />}
                                  {msg.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                                  {msg.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-400" />}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-3 bg-card border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input 
                  placeholder="Tapez un message..." 
                  className="bg-muted/50 border-none focus-visible:ring-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                <Button 
                  size="icon" 
                  disabled={!newMessage.trim()}
                  onClick={handleSendMessage}
                  className="shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <Send className="h-10 w-10 text-muted-foreground -rotate-45" />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{association.name} Web</h2>
              <p className="text-muted-foreground">
                Envoyez et recevez des messages sans laisser votre téléphone allumé.<br />
                Utilisez {association.name} sur jusqu'à 4 appareils liés et 1 téléphone en même temps.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-8">
              <Badge variant="outline" className="text-[10px] font-normal">Chiffré de bout en bout</Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
