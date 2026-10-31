alter table public.profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.news_events enable row level security;
alter table public.bookings enable row level security;
alter table public.invoices enable row level security;
alter table public.documents enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.notifications enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.client_profiles to authenticated;
grant select, insert, update, delete on public.news_events to authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
grant select, insert, update, delete on public.invoices to authenticated;
grant select, insert, update, delete on public.documents to authenticated;
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.support_messages to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;

create policy "Profiles are visible only to their owner"
on public.profiles for select
using (auth.uid() = auth_user_id);

create policy "Profiles can be updated only by their owner"
on public.profiles for update
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

create policy "Clients can read their own profile data"
on public.client_profiles for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = client_profiles.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can update their own profile data"
on public.client_profiles for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = client_profiles.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = client_profiles.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can read their own bookings"
on public.bookings for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = bookings.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can manage their own bookings"
on public.bookings for all
using (
  exists (
    select 1 from public.profiles p
    where p.id = bookings.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = bookings.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can read their own invoices"
on public.invoices for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = invoices.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can manage their own documents"
on public.documents for all
using (
  exists (
    select 1 from public.profiles p
    where p.id = documents.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = documents.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can read their own tickets and messages"
on public.support_tickets for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = support_tickets.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can manage their own tickets"
on public.support_tickets for all
using (
  exists (
    select 1 from public.profiles p
    where p.id = support_tickets.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = support_tickets.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can read their own notifications"
on public.notifications for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = notifications.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can update their own notifications"
on public.notifications for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = notifications.profile_id
      and p.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = notifications.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "News and events are readable to authenticated users"
on public.news_events for select
using (auth.uid() is not null);

create policy "Authenticated users can create support messages for their tickets"
on public.support_messages for insert
with check (
  exists (
    select 1 from public.profiles p
    where p.id = support_messages.profile_id
      and p.auth_user_id = auth.uid()
  )
);

create policy "Clients can read their own support messages"
on public.support_messages for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = support_messages.profile_id
      and p.auth_user_id = auth.uid()
  )
);
