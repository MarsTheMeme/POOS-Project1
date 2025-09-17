import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { addContactSchema, type AddContactRequest, type SearchContactsResponse } from "@shared/schema";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Contact {
  name: string;
  id: string;
  status: {
    color: string;
    animation: string;
    text: string;
  };
}

const statusOptions = [
  { color: "bg-primary", animation: "animate-pulse", text: "ONLINE" },
  { color: "bg-green-400", animation: "animate-pulse", text: "AVAILABLE" },
  { color: "bg-yellow-400", animation: "", text: "AWAY" },
  { color: "bg-secondary", animation: "", text: "OFFLINE" },
  { color: "bg-blue-400", animation: "animate-pulse", text: "SECURE" },
  { color: "bg-purple-400", animation: "animate-pulse", text: "ENCRYPTED" },
  { color: "bg-red-400", animation: "", text: "HOSTILE" }
];

function getRandomStatus() {
  return statusOptions[Math.floor(Math.random() * statusOptions.length)];
}

export default function ContactsPage() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ contact: string }>({
    resolver: zodResolver(addContactSchema.pick({ contact: true })),
  });

  useEffect(() => {
    // Add a small delay to prevent navigation during cookie reading
    const timer = setTimeout(() => {
      if (!user) {
        console.log("No user found, redirecting to login");
        navigate("/");
        return;
      }
      console.log("User found:", user);
      // Load contacts on startup
      searchContacts("");
    }, 100);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const searchContacts = async (search: string = searchTerm) => {
    if (!user) return;

    setIsSearching(true);
    try {
      const response: SearchContactsResponse = await api.searchContacts({
        search,
        userId: user.id,
      });

      if (response.error === "") {
        const contactList = response.results.map(name => ({
          name: name.toUpperCase(),
          id: name.toLowerCase().replace(/\s+/g, '-'),
          status: getRandomStatus(),
        }));
        setContacts(contactList);

        if (search.trim() !== "") {
          toast({
            title: "SCAN COMPLETE",
            description: `Found ${response.results.length} contacts in neural grid`,
          });
        }
      } else {
        setContacts([]);
        if (search.trim() !== "") {
          toast({
            title: "SCAN RESULT",
            description: response.error,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "CONNECTION ERROR",
        description: "Failed to scan neural grid",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addContact = async (data: { contact: string }) => {
    if (!user) return;

    setIsAdding(true);
    try {
      const response = await api.addContact({
        contact: data.contact,
        userId: user.id,
      });

      if (response.error === "") {
        toast({
          title: "CONTACT ADDED",
          description: "Contact added to neural grid",
        });
        reset();
        // Refresh contacts list
        searchContacts("");
      } else {
        toast({
          title: "ERROR",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "CONNECTION ERROR",
        description: "Failed to add contact",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const removeContact = (contactId: string, contactName: string) => {
    // Show confirmation dialog
    if (confirm(`Are you sure you want to remove '${contactName}' from the neural grid?`)) {
      // TODO: Implement actual contact removal API call
      toast({
        title: "CONTACT REMOVED",
        description: `${contactName} removed from neural grid`,
      });
      // Refresh contacts list
      searchContacts("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "NEURAL LINK DISCONNECTED",
      description: "Session terminated",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header Bar */}
      <div className="bg-card neon-border rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary font-mono neon-glow">NEURAL GRID</h1>
            <div className="text-sm text-muted-foreground">
              <span className="font-mono">Logged in as {user.firstName} {user.lastName}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground">
              <i className="fas fa-circle text-green-400 mr-1"></i>CONNECTED
            </div>
            <CyberButton
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <i className="fas fa-power-off mr-2"></i>DISCONNECT
            </CyberButton>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Section */}
          <div className="bg-card neon-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-primary font-mono">
              <i className="fas fa-search mr-2"></i>SEARCH GRID
            </h2>
            <div className="space-y-4">
              <CyberInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search neural contacts..."
                onKeyPress={(e) => e.key === 'Enter' && searchContacts()}
                data-testid="input-search"
              />
              <CyberButton
                onClick={() => searchContacts()}
                disabled={isSearching}
                className="w-full"
                data-testid="button-search"
              >
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    SCANNING...
                  </div>
                ) : (
                  <>
                    <i className="fas fa-satellite-dish mr-2"></i>SCAN NETWORK
                  </>
                )}
              </CyberButton>
            </div>
          </div>

          {/* Add Contact Section */}
          <div className="bg-card neon-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-primary font-mono">
              <i className="fas fa-plus-circle mr-2"></i>NEW CONTACT
            </h2>
            <form onSubmit={handleSubmit(addContact)} className="space-y-4">
              <CyberInput
                {...register("contact")}
                placeholder="Enter contact name..."
                data-testid="input-contact"
                disabled={isAdding}
              />
              {errors.contact && (
                <p className="text-destructive text-sm font-mono">{errors.contact.message}</p>
              )}
              <CyberButton
                type="submit"
                variant="secondary"
                disabled={isAdding}
                className="w-full"
                data-testid="button-add-contact"
              >
                {isAdding ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    ADDING...
                  </div>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-2"></i>ADD TO GRID
                  </>
                )}
              </CyberButton>
            </form>
          </div>

          {/* Isometric Device Graphic */}
          <div className="bg-card neon-border rounded-lg p-6 text-center">
            <div className="isometric-device mb-4 mx-auto w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-mobile-alt text-4xl text-primary-foreground"></i>
            </div>
            <p className="text-xs text-muted-foreground font-mono">NEURAL INTERFACE v2.4.7</p>
          </div>
        </div>

        {/* Right Panel - Contacts Display */}
        <div className="lg:col-span-2">
          <div className="bg-card neon-border rounded-lg p-6 min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-primary font-mono neon-glow">
                <i className="fas fa-address-book mr-2"></i>CONTACTS
              </h2>
              <div className="text-sm text-muted-foreground font-mono">
                GRID MEMBERS: <span data-testid="text-contact-count">{contacts.length}</span>
              </div>
            </div>

            {/* Contacts List */}
            <div className="space-y-3">
              {contacts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 font-mono">
                  {isSearching ? "Scanning neural grid..." : "No contacts found in neural grid"}
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={cn(
                      "contact-card p-4 rounded-lg cursor-pointer",
                      selectedContact === contact.id && "selected"
                    )}
                    onClick={() => setSelectedContact(contact.id)}
                    data-testid={`card-contact-${contact.id}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          contact.status.color,
                          contact.status.animation
                        )}></div>
                        <span className="font-mono text-foreground font-semibold">
                          {contact.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          {contact.status.text}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeContact(contact.id, contact.name);
                          }}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground p-1 rounded"
                          title="Remove Contact"
                          data-testid={`button-remove-${contact.id}`}
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Contact Actions */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex justify-center space-x-4">
                <CyberButton size="sm" disabled={!selectedContact} data-testid="button-call">
                  <i className="fas fa-phone mr-2"></i>CALL
                </CyberButton>
                <CyberButton size="sm" disabled={!selectedContact} data-testid="button-message">
                  <i className="fas fa-envelope mr-2"></i>MESSAGE
                </CyberButton>
                <CyberButton 
                  variant="destructive" 
                  size="sm" 
                  disabled={!selectedContact}
                  data-testid="button-block"
                >
                  <i className="fas fa-ban mr-2"></i>BLOCK
                </CyberButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
