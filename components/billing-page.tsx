"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, CreditCard, Download, BrainCircuit, Zap } from "lucide-react"

export function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">Manage your subscription and payment methods.</p>
      </div>

      <Tabs defaultValue="subscription">
        <TabsList>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="llm-usage">API Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your current subscription plan and usage.</CardDescription>
                </div>
                <Badge className="bg-primary text-primary-foreground">Pro Plan</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">$49/month, billed monthly</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Up to 5 chatbots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">10,000 messages per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Access to all LLM models</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Usage This Month</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Chatbots</p>
                    <p className="text-sm font-medium">3 of 5</p>
                  </div>
                  <Progress value={60} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Messages</p>
                    <p className="text-sm font-medium">8,230 of 10,000</p>
                  </div>
                  <Progress value={82} />
                  <p className="text-xs text-muted-foreground">Resets on June 1, 2023</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">LLM Tokens</p>
                    <p className="text-sm font-medium">1.2M of 2M</p>
                  </div>
                  <Progress value={60} />
                  <p className="text-xs text-muted-foreground">Resets on June 1, 2023</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="text-destructive">
                Cancel Subscription
              </Button>
              <Button>Upgrade to Business</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For small businesses just getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$19</div>
                <p className="text-sm text-muted-foreground">per month</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">1 chatbot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">2,000 messages/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Basic analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Email support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">GPT-3.5 Turbo only</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Downgrade
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  <Badge>Current</Badge>
                </div>
                <CardDescription>For growing businesses with multiple stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$49</div>
                <p className="text-sm text-muted-foreground">per month</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Up to 5 chatbots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">10,000 messages/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">All LLM models</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <CardDescription>For large businesses with high volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$99</div>
                <p className="text-sm text-muted-foreground">per month</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Unlimited chatbots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">50,000 messages/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">24/7 support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom LLM fine-tuning</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Upgrade</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and billing information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-16 items-center justify-center rounded-md border bg-muted">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
              </div>

              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Your billing address and tax information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Billing Address</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p>John Doe</p>
                  <p>123 Main Street</p>
                  <p>San Francisco, CA 94103</p>
                  <p>United States</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Tax Information</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Tax ID: US123456789</p>
                  <p>VAT Number: Not provided</p>
                </div>
              </div>

              <Button variant="outline">Update Billing Information</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View and download your past invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "INV-001", date: "May 1, 2023", amount: "$49.00", status: "Paid" },
                  { id: "INV-002", date: "Apr 1, 2023", amount: "$49.00", status: "Paid" },
                  { id: "INV-003", date: "Mar 1, 2023", amount: "$49.00", status: "Paid" },
                  { id: "INV-004", date: "Feb 1, 2023", amount: "$49.00", status: "Paid" },
                  { id: "INV-005", date: "Jan 1, 2023", amount: "$49.00", status: "Paid" },
                ].map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <Badge
                        variant={invoice.status === "Paid" ? "outline" : "secondary"}
                        className={
                          invoice.status === "Paid"
                            ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : ""
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm-usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom LLM API Usage</CardTitle>
              <CardDescription>Monitor your LLM token usage and associated costs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Total Tokens Used</h3>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">1.2M</div>
                    <p className="text-xs text-muted-foreground">This billing period</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Estimated Cost</h3>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">$18.50</div>
                    <p className="text-xs text-muted-foreground">This billing period</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Tokens Remaining</h3>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">800K</div>
                    <p className="text-xs text-muted-foreground">Of 2M included in plan</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">API Usage Statistics</h3>
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10">
                          Total API Calls
                        </Badge>
                        <span className="text-sm">1.2M calls</span>
                      </div>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-muted">
                          Average Response Size
                        </Badge>
                        <span className="text-sm">4.2KB</span>
                      </div>
                      <span className="font-medium">+5%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-muted">
                          Error Rate
                        </Badge>
                        <span className="text-sm">0.5%</span>
                      </div>
                      <span className="font-medium">-0.2%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Usage History</h3>
                <div className="rounded-lg border">
                  <div className="grid grid-cols-4 border-b p-3 font-medium">
                    <div>Date</div>
                    <div>API Type</div>
                    <div>Requests</div>
                    <div className="text-right">Duration</div>
                  </div>
                  {[
                    { date: "May 10, 2023", type: "Chat Completion", requests: "12,450", duration: "1.2s avg" },
                    { date: "May 9, 2023", type: "Chat Completion", requests: "18,320", duration: "1.3s avg" },
                    { date: "May 9, 2023", type: "Embeddings", requests: "8,750", duration: "0.8s avg" },
                    { date: "May 8, 2023", type: "Chat Completion", requests: "15,600", duration: "1.1s avg" },
                    { date: "May 8, 2023", type: "Embeddings", requests: "7,200", duration: "0.7s avg" },
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-4 border-b p-3 text-sm">
                      <div>{item.date}</div>
                      <div>{item.type}</div>
                      <div>{item.requests}</div>
                      <div className="text-right">{item.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Usage Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
