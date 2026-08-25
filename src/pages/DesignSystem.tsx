import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Textarea } from '../components/ui/Textarea';
import { Modal } from '../components/ui/Modal';
import { BottomNav } from '../components/layout/BottomNav';
import { Search, Mail, Bell } from 'lucide-react';
import { useState } from 'react';

export default function DesignSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12 pb-24">
      <div>
        <h1 className="text-3xl font-bold mb-2">MOVO Design System</h1>
        <p className="text-text-muted dark:text-text-darkMuted">Phase 1 component library preview.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center mt-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large Button</Button>
          <Button size="icon"><Bell className="w-5 h-5" /></Button>
          <Button isLoading>Loading</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">Inputs & Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <Input label="Email address" placeholder="Enter your email" type="email" icon={<Mail className="w-5 h-5" />} />
          <Input label="Search activities" placeholder="E.g. Badminton, Coffee..." icon={<Search className="w-5 h-5" />} />
          <Input label="Username" placeholder="Enter username" error="Username is already taken." />
          <Input label="Disabled Input" placeholder="Cannot type here" disabled />
          <div className="md:col-span-2">
            <Textarea label="Bio" placeholder="Tell us about yourself..." />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">Avatars</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <Avatar size="sm" initials="AJ" />
          <Avatar size="md" initials="AJ" />
          <Avatar size="lg" initials="AJ" />
          <Avatar size="xl" initials="AJ" />
          <Avatar size="lg" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Available</Badge>
          <Badge variant="warning">Starting soon</Badge>
          <Badge variant="error">Cancelled</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="default">Sports</Badge>
                <span className="text-sm font-medium text-text-muted dark:text-text-darkMuted">1.4 km away</span>
              </div>
              <CardTitle>⚡ Badminton</CardTitle>
              <CardDescription>Today · 6:30 PM</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Looking for 2 more people to join a casual badminton game at City Sports Arena.</p>
              <div className="mt-4 flex items-center text-sm font-medium">
                <span className="text-primary-600 dark:text-primary-400">2 / 4 joined</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-text-muted dark:text-text-darkMuted">Hosted by Arjun</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Join Plan</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">Modals & Overlays</h2>
        <div>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          
          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            title="Join Activity"
            description="Are you sure you want to join this activity? Your profile will be visible to the host."
            footer={
              <>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsModalOpen(false)}>Confirm Join</Button>
              </>
            }
          >
            <div className="py-4">
              <p className="text-sm text-text-muted dark:text-text-darkMuted">This will notify the host and add you to the participant list.</p>
            </div>
          </Modal>
        </div>
      </section>

      <section className="space-y-4 pt-12">
        <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-800 pb-2">Navigation</h2>
        <div className="relative h-32 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/20">
          <p className="text-center text-sm text-gray-500 mt-4">Simulated mobile viewport</p>
          <div className="absolute bottom-0 w-full pointer-events-none">
            <BottomNav />
          </div>
        </div>
      </section>
    </div>
  );
}
