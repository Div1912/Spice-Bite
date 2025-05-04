"use client"

import type React from "react"

import { useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon!",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <PageTransition>
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have questions, feedback, or need assistance? We're here to help! Reach out to our team using any of the
            methods below.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="border-2 border-primary/20 shadow-lg transition-transform hover:scale-105">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Our Location</h3>
                    <p className="text-sm text-muted-foreground">3A Moharkunja Apartment, New Town, Kolkata 700157</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 shadow-lg transition-transform hover:scale-105">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone Number</h3>
                    <p className="text-sm text-muted-foreground">+91 7004238685</p>
                    <p className="text-sm text-muted-foreground">+91 8800123456</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 shadow-lg transition-transform hover:scale-105">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Address</h3>
                    <p className="text-sm text-mute\
