"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileQuestion, HelpCircle, MessageSquare, Search } from "lucide-react"

export function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Support</h2>
        <p className="text-muted-foreground">Get help with your chatbot and account.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search for help articles..."
          className="md:w-[300px]"
          prefix={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </div>

      <Tabs defaultValue="faq">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="faq">
            <FileQuestion className="mr-2 h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="docs">
            <BookOpen className="mr-2 h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about our platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  question: "How do I connect my e-commerce store?",
                  answer:
                    "You can connect your store by going to the Store Integration page and selecting your platform (WooCommerce, Shopify, or YouCan). Follow the instructions to authorize the connection and sync your product catalog.",
                },
                {
                  question: "How does the AI chatbot learn about my products?",
                  answer:
                    "Once your store is connected, our AI automatically indexes your product catalog, categories, descriptions, and pricing. It uses this information to provide accurate responses to customer queries about your products.",
                },
                {
                  question: "Can I customize the chatbot's appearance?",
                  answer:
                    "Yes, you can customize the chatbot's appearance in the Chatbot Configuration page. You can change the name, avatar, welcome message, and color scheme to match your brand.",
                },
                {
                  question: "How do I upgrade my subscription plan?",
                  answer:
                    "You can upgrade your subscription plan in the Billing page. Select the plan that best fits your needs and follow the instructions to complete the upgrade process.",
                },
                {
                  question: "What happens if I exceed my monthly message limit?",
                  answer:
                    "If you exceed your monthly message limit, you'll be notified and given the option to upgrade to a higher plan. Your chatbot will continue to function, but you may be charged for additional messages at the rate specified in your plan.",
                },
              ].map((item, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <h3 className="font-medium">{item.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All FAQs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Explore our comprehensive documentation and guides.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Learn the basics of setting up your chatbot and connecting your store.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Read Guide
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Advanced Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Dive deeper into customizing your chatbot's behavior and responses.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Read Guide
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Analytics & Reporting</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Learn how to interpret and leverage your chatbot analytics.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Read Guide
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">API Documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Technical documentation for developers integrating with our API.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Read Guide
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Browse All Documentation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team for personalized assistance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Please describe your issue in detail..." rows={5} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachment">Attachments (optional)</Label>
                <Input id="attachment" type="file" />
                <p className="text-xs text-muted-foreground">
                  You can attach screenshots or other files to help us understand your issue.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Submit Ticket</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Get Help</CardTitle>
              <CardDescription>Explore alternative support channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4 text-center">
                  <HelpCircle className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="mt-2 font-medium">Live Chat</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Chat with our support team in real-time.</p>
                  <Button variant="link" className="mt-2">
                    Start Chat
                  </Button>
                </div>

                <div className="rounded-lg border p-4 text-center">
                  <MessageSquare className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="mt-2 font-medium">Email Support</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Send us an email and we'll respond within 24 hours.
                  </p>
                  <Button variant="link" className="mt-2">
                    Email Us
                  </Button>
                </div>

                <div className="rounded-lg border p-4 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-primary" />
                  <h3 className="mt-2 font-medium">Knowledge Base</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Browse our extensive knowledge base articles.</p>
                  <Button variant="link" className="mt-2">
                    Explore
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
